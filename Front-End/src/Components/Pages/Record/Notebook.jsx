import React from 'react';
import styles from './Notebook.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCalendarAlt, faExclamationTriangle, faGun } from '@fortawesome/free-solid-svg-icons';
import logo from '/logo.png';

const Notebook = ({ title, link }) => {
  let IconComponent;

  switch (title) {
    case 'Weapon Records':
      IconComponent = faGun;
      break;
    case 'Daily Records':
      IconComponent = faCalendarAlt;
      break;
    case 'Damaged Records':
      IconComponent = faExclamationTriangle;
      break;
    default:
      IconComponent = faBook;
  }

  return (
    <Link to={link} style={{ textDecoration: 'none', color: 'white' }}>
      <div className={styles.notebookWrapper}>
        <div className={styles.moleskineNotebook}>
          <div className={styles.notebookCover}>
            <div className={styles.logoTitleContainer}>
              <img src={logo} alt="Indian Army Logo" className={styles.logo} />
              <span className={styles.indianArmyTitle}>Indian Army</span>
            </div>
            <div className={styles.notebookSkin}>
              {title}
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={IconComponent} className={styles.icon} />
              </div>
            </div>
          </div>
          <div className={`${styles.notebookPage} ${styles.ruled}`}>
            <div className={styles.notebookMessage}>Click here to see {title}</div>
          </div>
          <div className={styles.spiralBinding}>
            {/* Create multiple spiral rings */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <h4 className={styles.notebookTitle}>{title}</h4>
      </div>
    </Link>
  );
};

export default Notebook;
