import styles from './styles';

interface IBurgerToggle {
  isOpened: boolean,
  setIsOpened: (v: boolean) => void,
}

export default function BurgerToggle({ isOpened, setIsOpened }: IBurgerToggle) {
  return (
    <styles.Toggle isOpen={isOpened} onClick={() => setIsOpened(!isOpened)}>
      <div><span /></div>
      <div><span /></div>
      <div><span /></div>
    </styles.Toggle>
  );
}
