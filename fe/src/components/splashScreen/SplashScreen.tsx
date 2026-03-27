import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

interface SplashScreenProps {
  onFinished: () => void;
}

export const SplashScreen = ({ onFinished }: SplashScreenProps) => {
  const [step, setStep] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1200);

    const t3 = setTimeout(() => {
      if (step === 2) setIsMoving(true);
    }, 1500);

    const t4 = setTimeout(() => {
      onFinished();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [step, onFinished]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <img
          src="../../assets/splashScreenLogos/logo1.png"
          className={`${styles.logoBase} ${step === 0 ? styles.visible : styles.hidden}`}
          alt="Logo 1"
        />
        <img
          src="../../assets/splashScreenLogos/logo2.png"
          className={`${styles.logoBase} ${step === 1 ? styles.visible : styles.hidden}`}
          alt="Logo 2"
        />

        <div
          className={`${styles.brandWrapper} ${step === 2 ? styles.visible : styles.hidden}`}
        >
          <img
            src="../../assets/splashScreenLogos/logo3.png"
            className={`${styles.logoIcon} ${isMoving ? styles.slideLeft : ""}`}
            alt="Logo 3"
          />
          <img
            src="../../assets/splashScreenLogos/brand.png"
            className={`${styles.brandImage} ${isMoving ? styles.reveal : styles.hiddenImg}`}
            alt="Brand Name"
          />
        </div>
      </div>
    </div>
  );
};
