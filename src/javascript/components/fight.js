import controls from '../../constants/controls';
import throttle from '../helpers/throttle';

function getCriticalHitChance() {
    return Math.random() + 1;
}

function getDodgeChance() {
    return Math.random() + 1;
}

export function getHitPower(fighter) {
    return fighter.attack * getCriticalHitChance();
}

export function getBlockPower(fighter) {
    return fighter.defense * getDodgeChance();
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage < 0 ? 0 : damage;
}

function decreaseHealth(fighter, damage, initialHealth, indicators) {
    // eslint-disable-next-line no-param-reassign
    fighter.health -= damage > fighter.health ? fighter.health : damage;

    if (fighter.isLeft) {
        // eslint-disable-next-line no-param-reassign
        indicators.leftFighterIndicator.style.width = `${(fighter.health / initialHealth) * 100}%`;
    } else {
        // eslint-disable-next-line no-param-reassign
        indicators.rightFighterIndicator.style.width = `${(fighter.health / initialHealth) * 100}%`;
    }
}

const decreaseHealthForFirstWithCriticalHit = throttle(decreaseHealth, 10000);
const decreaseHealthForSecondWithCriticalHit = throttle(decreaseHealth, 10000);

export async function fight(firstFighter, secondFighter) {
    const leftFighterIndicator = document.getElementById('left-fighter-indicator');
    const rightFighterIndicator = document.getElementById('right-fighter-indicator');

    const indicators = {
        leftFighterIndicator,
        rightFighterIndicator
    };

    const getWinner = (firstFighterStats, secondFighterStats) => {
        if (firstFighterStats.health <= 0) {
            return secondFighter;
        }

        if (secondFighterStats.health <= 0) {
            return firstFighter;
        }

        return null;
    };

    const {
        PlayerOneAttack,
        PlayerOneBlock,
        PlayerTwoAttack,
        PlayerTwoBlock,
        PlayerOneCriticalHitCombination,
        PlayerTwoCriticalHitCombination
    } = controls;

    const firstFighterStats = {
        health: firstFighter.health,
        isBlock: false,
        isLeft: true
    };

    const secondFighterStats = {
        health: secondFighter.health,
        isBlock: false,
        isLeft: false
    };

    let playerOneCriticalHitCombinationPressed = [];
    let playerTwoCriticalHitCombinationPressed = [];

    return new Promise(resolve => {
        const keyUpEventListener = event => {
            const { code } = event;

            if (code === PlayerOneBlock) {
                firstFighterStats.isBlock = false;
            } else if (code === PlayerTwoBlock) {
                secondFighterStats.isBlock = false;
            } else if (PlayerOneCriticalHitCombination.includes(code)) {
                playerOneCriticalHitCombinationPressed = playerOneCriticalHitCombinationPressed.filter(
                    key => key !== code
                );
            } else if (PlayerTwoCriticalHitCombination.includes(code)) {
                playerTwoCriticalHitCombinationPressed = playerTwoCriticalHitCombinationPressed.filter(
                    key => key !== code
                );
            }
        };

        const keyDownEventListener = event => {
            const { code, repeat } = event;
            if (repeat) return;

            if (
                (code === PlayerOneAttack || code === PlayerTwoAttack) &&
                !firstFighterStats.isBlock &&
                !secondFighterStats.isBlock
            ) {
                if (code === PlayerOneAttack) {
                    decreaseHealth(
                        secondFighterStats,
                        getDamage(firstFighter, secondFighter),
                        secondFighter.health,
                        indicators
                    );
                } else if (code === PlayerTwoAttack) {
                    decreaseHealth(
                        firstFighterStats,
                        getDamage(secondFighter, firstFighter),
                        firstFighter.health,
                        indicators
                    );
                }
            } else if (code === PlayerOneBlock || code === PlayerTwoBlock) {
                if (code === PlayerOneBlock) {
                    firstFighterStats.isBlock = true;
                } else if (code === PlayerTwoBlock) {
                    secondFighterStats.isBlock = true;
                }
            } else if (PlayerOneCriticalHitCombination.includes(code)) {
                playerOneCriticalHitCombinationPressed.push(code);
                if (playerOneCriticalHitCombinationPressed.length === PlayerOneCriticalHitCombination.length) {
                    decreaseHealthForSecondWithCriticalHit(
                        secondFighterStats,
                        firstFighter.attack * 2,
                        secondFighter.health,
                        indicators
                    );
                    playerOneCriticalHitCombinationPressed.length = 0;
                }
            } else if (PlayerTwoCriticalHitCombination.includes(code)) {
                playerTwoCriticalHitCombinationPressed.push(code);
                if (playerTwoCriticalHitCombinationPressed.length === PlayerTwoCriticalHitCombination.length) {
                    decreaseHealthForFirstWithCriticalHit(
                        firstFighterStats,
                        secondFighter.attack * 2,
                        firstFighter.health,
                        indicators
                    );
                    playerTwoCriticalHitCombinationPressed.length = 0;
                }
            }

            const winner = getWinner(firstFighterStats, secondFighterStats);

            if (winner) {
                document.removeEventListener('keydown', keyDownEventListener);
                document.removeEventListener('keyup', keyUpEventListener);
                resolve(winner);
            }
        };

        document.addEventListener('keydown', keyDownEventListener);
        document.addEventListener('keyup', keyUpEventListener);
    });
}
