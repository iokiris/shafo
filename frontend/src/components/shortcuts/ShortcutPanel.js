import React, { useState, useEffect, useRef } from 'react';
import {ru} from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import './ShortcutPanel.css';
import withAuthCheck from '../highers/withAuthCheck'
import CopySvg from '../../media/svg/Things/CopySvg';
const MAX_SHORTCUT_SECTION = 20;

function ShortenUrl({ url, maxLength = 32 }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (url.length <= maxLength || isExpanded) {
    if (isExpanded) {return <span>
      {url} 
      <span onClick={() => setIsExpanded(false)} style={{ cursor: 'pointer', color: 'var(--legit-blue)' }}> ▲</span>
      </span>;} 
      else {
        return <span>{url}</span>
      }
  }

  return (
    <span>
      {url.substring(0, maxLength - 3)}
      <span onClick={() => setIsExpanded(true)} style={{ cursor: 'pointer', color: 'var(--legit-blue)' }}> ...</span>
    </span>
  );
}


function ShortcutsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [shortcuts, setShortcuts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [sortType, setSortType] = useState('created_at');
  const loadingRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');


  useEffect(() => {
    setShortcuts([]);
    setOffset(0); 
    setAllLoaded(false); 
    fetchShortcuts(0, sortType); 
  }, [sortType]);

  useEffect(() => {
    fetchShortcuts(offset, sortType);
  }, [offset]);

  useEffect(() => {
  const handler = setTimeout(() => {
    setShortcuts([]);
    setOffset(0); 
    setAllLoaded(false); 
    fetchShortcuts(0, sortType, searchQuery); 
  }, 500);

  return () => clearTimeout(handler);
}, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setOffset((prevOffset) => prevOffset + 20);
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });
  
    if (loadingRef.current) observer.observe(loadingRef.current);
  
    return () => {
      if (loadingRef.current) observer.unobserve(loadingRef.current);
    };
  }, [loading]);

  const toggleShortcutStatus = async (shortcutId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
        const response = await api.post('/remote_sc_visibility/', {
            id: shortcutId,
            visibility: newStatus
        });
        if (response.data && response.data.visibility !== undefined) {
            const updatedShortcuts = shortcuts.map(sc => {
                if (sc.id === shortcutId) {
                    return { ...sc, public: response.data.visibility };
                }
                return sc;
            });
            setShortcuts(updatedShortcuts);
        }
    } catch (error) {
        console.error('Ошибка при изменении статуса');
    }
};

  
const addNewShortcut = async () => {
    const shortcutData = {
      full_url: newUrl,
    };
  
    try {
      const response = await api.post('/create_shortcut/', shortcutData);
      const newShortcut = response.data.shortcut;
      if (newShortcut) {
        shortcuts.unshift(newShortcut);
        setNewUrl(''); 
      }
    } catch (error) {
      console.error('Ошибка при добавлении новой ссылки');
    }
  };
  const fetchShortcuts = async (newOffset, sortType, query = searchQuery) => { 
    try {
      if (allLoaded) {
        return;
      };
      if (loading) return;
      setLoading(true);
      const response = await fetch(`/api/load_shortcuts/?offset=${newOffset}&sort_by=${sortType}&query=${encodeURIComponent(query)}`, { method: 'GET' });
      const data = await response.json();
      if (data.shortcuts.length < MAX_SHORTCUT_SECTION) {
          setAllLoaded(true);
      }
      if (data.shortcuts.length > 0) {
        setShortcuts((prevShortcuts) => {
          const existingIds = new Set(prevShortcuts.map(sc => sc.id));
          const filteredNewShortcuts = data.shortcuts.filter(sc => !existingIds.has(sc.id));
          return [...prevShortcuts, ...filteredNewShortcuts];
        });
      }
      setLoading(false);
    } catch (e) {
    }
};
  
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setOffset(shortcuts.length);
    }
  };

  const copyToClipboard = async (text) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  };
  
  return (
    <>
    <div className="shortcuts-header">
        {isModalOpen && (
        <div className="modal">
        <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <p style={{color: '#141411'}}>Создать короткую ссылку</p>
            <input type="text" placeholder="Введите полную ссылку..." value={newUrl} onChange={(e) => setNewUrl(e.target.value)} maxLength="2048" />
            <button onClick={addNewShortcut}>Добавить</button>
        </div>
        </div>
        )}
        <div className="sc-control-panel">
        <div style={{display: 'flex', gap: '10px'}}>
            <button className="add-button" onClick={() => setIsModalOpen(true)}>Новая ссылка</button>
            <select className="sc-sort-type-selector" value={sortType} onChange={(e) => { setSortType(e.target.value);}}>
                <option value="created_at">Сначала новыеㅤ</option>
                <option value="id">Сначала старыеㅤ</option>
                <option value="public">Публичныеㅤ</option>
                <option value="private">Приватныеㅤ</option>
            </select>
        </div>
        <input
        type="text" 
        placeholder="Введите полную ссылку..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        className="sc-search-zone"
        />
        </div>
    </div>
    <div className="shortcuts-panel" onScroll={handleScroll}>
        {shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut">
            <div className="shortcut-header">
                <div className="shortcut-url" onClick={() => copyToClipboard(
                  window.location.origin + "/c/" + shortcut.short_url
                  )}>
                {shortcut.short_url}
                <CopySvg
                />
                </div>
                <button 
                    className={"shortcut-status " + (shortcut.public ? 'sc-active' : 'sc-archived')}
                    onClick={() => toggleShortcutStatus(shortcut.id, shortcut.public)}
                >{shortcut.public ? 'Активна' : 'Скрыта'}</button>
            </div>
            
            <div className="shortcut-fullurl" ><CopySvg onClick={() => copyToClipboard(shortcut.full_url)}
                />Переадресация: <ShortenUrl url={shortcut.full_url} />
              
            </div>            
            <div className="shortcut-metadata">Создана: <span>{formatDistanceToNow(new Date(shortcut.created_at), { addSuffix: true, locale: ru })}</span></div>
            </div>
        ))}
        <div ref={loadingRef} className={"loading " + (allLoaded ? 'invisible' : 'visible')}>Загрузка...</div>
    </div>
    </>
  );
}

const AuthSP = withAuthCheck(ShortcutsPanel);
export default AuthSP;
