// import React from 'react';
// import './FaceDataViewer.css';

// function FaceDataViewer({ data }) {
//     if (!data || data.length === 0) {
//       return <div className="faceDataContainer">Данные не найдены</div>;
//     }
  
//     const faceData = data[0];
  
//     const racesArray = Object.entries(faceData.race || {}).map(([race, value]) => ({
//       race: translateRace(race),
//       value: value ? value.toFixed(2) : '0.00',
//     })).filter(race => race.value !== '0.00')
//     .sort((a, b) => b.value - a.value);

//     const emotionsArray = Object.entries(faceData.emotion || {}).map(([emotion, value]) => ({
//       emotion: translateEmotion(emotion),
//       value: value ? value.toFixed(2) : '0.00',
//     })).filter(emotion => emotion.value !== '0.00')
//     .sort((a, b) => b.value - a.value);

//   return (
//     <div className="faceDataContainer">
//       <h2>Результаты анализа лица</h2>
//       <div className="dataField">
//   <strong>Расы:</strong>
//   <ul className="raceList">
//     {racesArray.map(race => <li key={race.race}>{race.race}: <span className="valuePercentage">{race.value}%</span></li>)}
//   </ul>
// </div>
// <div className="dataField">
//   <strong>Эмоции:</strong>
//   <ul className="emotionList">
//     {emotionsArray.map(emotion => <li key={emotion.emotion}>{emotion.emotion}: <span className="valuePercentage">{emotion.value}%</span></li>)}
//   </ul>
// </div>
//       </div>
//   );
// }
// function translateRace(race) {
//     switch (race) {
//       case 'asian': return 'Азиат';
//       case 'indian': return 'Индиец';
//       case 'black': return 'Черный';
//       case 'white': return 'Белый';
//       case 'middle eastern': return 'Средневосточный';
//       case 'latino hispanic': return 'Латиноамериканец';
//       default: return race;
//     }
// }

// function translateEmotion(emotion) {
//     const translations = {
//       angry: 'Злость',
//       disgust: 'Отвращение',
//       fear: 'Страх',
//       happy: 'Счастье',
//       sad: 'Грусть',
//       surprise: 'Удивление',
//       neutral: 'Нейтральность',
//     };
  
//     return translations[emotion] || emotion;
//   }

// export default FaceDataViewer;
