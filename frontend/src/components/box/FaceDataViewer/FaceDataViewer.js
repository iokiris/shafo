import React from 'react';
import './FaceDataViewer.css';

function FaceDataViewer({ data }) {
    // Проверка на существование данных
    if (!data || data.length === 0) {
      return <div className="faceDataContainer">Данные не найдены</div>;
    }
  
    const faceData = data[0];
  
    const racesArray = Object.entries(faceData.race || {}).map(([race, value]) => ({
      race: translateRace(race),
      value: value ? value.toFixed(2) : '0.00', // Добавлена проверка на существование value
    })).sort((a, b) => b.value - a.value);

  return (
    <div className="faceDataContainer">
      <h2>Результаты анализа лица</h2>
      <div className="dataField"><strong>Возраст:</strong> {faceData.age}</div>
      <div className="dataField"><strong>Пол:</strong> {faceData.dominant_gender === "Man" ? "Мужчина" : "Женщина"}</div>
      <div className="dataField"><strong>Расы:</strong> {racesArray.map(race => `${race.race}: ${race.value}%`).join(', ')}</div>
      <div className="dataField"><strong>Доминирующая эмоция:</strong> {translateEmotion(faceData.dominant_emotion)}</div>
      <div className="dataField">
        <strong>Эмоции:</strong> Злость: {faceData.emotion.angry.toFixed(2)}%, Отвращение: {faceData.emotion.disgust.toFixed(2)}%, Страх: {faceData.emotion.fear.toFixed(2)}%, Счастье: {faceData.emotion.happy.toFixed(2)}%, Грусть: {faceData.emotion.sad.toFixed(2)}%, Удивление: {faceData.emotion.surprise.toFixed(2)}%, Нейтральность: {faceData.emotion.neutral.toFixed(2)}%
      </div>
      <div className="dataField"><strong>Точность сканирования лица:</strong> {faceData.face_confidence}</div>
    </div>
  );
}
function translateRace(race) {
    switch (race) {
      case 'asian': return 'Азиат';
      case 'indian': return 'Индиец';
      case 'black': return 'Черный';
      case 'white': return 'Белый';
      case 'middle eastern': return 'Средневосточный';
      case 'latino hispanic': return 'Латиноамериканец';
      default: return race;
    }
}

function translateEmotion(emotion) {
    const translations = {
      angry: 'Злость',
      disgust: 'Отвращение',
      fear: 'Страх',
      happy: 'Счастье',
      sad: 'Грусть',
      surprise: 'Удивление',
      neutral: 'Нейтральность',
    };
  
    return translations[emotion] || emotion;
  }

export default FaceDataViewer;
