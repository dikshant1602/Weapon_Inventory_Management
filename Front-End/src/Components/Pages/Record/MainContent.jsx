import React from 'react';
import styles from './MainContent.module.css';
import Notebook from './Notebook';

const notebooks = [
  { title: 'Weapon Records' , link : '/overallrecord'},
  { title: 'Daily Records' ,link : '/weaponrecord'},
  { title: 'Damaged Records' , link :"/damagedweapons"},
];

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
     
      <div className={styles.wrapper}>
        {notebooks.map((notebook, index) => (
          <Notebook key={index}  title={notebook.title}  link={notebook.link}/>
        ))}
      </div>

    </div>
  );
};

export default MainContent;
