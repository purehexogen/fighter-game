import showModal from './modal';
import createElement from '../../helpers/domHelper';
// eslint-disable-next-line import/no-cycle
import App from '../../app';

export default function showWinnerModal(fighter) {
    const title = `${fighter.name} wins!`;
    const bodyElement = createElement({ tagName: 'div', className: 'modal-body' });
    bodyElement.innerText = 'Congratulations!\nClose this window to start a new game.';
    const onClose = () => {
        App.rootElement.innerHTML = '';
        App.startApp();
    };

    showModal({ title, bodyElement, onClose });
}
