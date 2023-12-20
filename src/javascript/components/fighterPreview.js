import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name, attack, defense, health } = fighter;
    const fighterInfo = `Name: ${name}\nAttack: ${attack}\nDefense: ${defense}\nHealth: ${health}`;
    const attributes = {
        src: source,
        title: fighterInfo,
        alt: fighterInfo
    };

    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const imageElement = createFighterImage(fighter);
        fighterElement.append(imageElement);
    }

    return fighterElement;
}
