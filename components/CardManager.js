import { Component } from 'react';
import CardResult from './CardResult';
import CardFinder from './CardFinder';
import { Grid } from 'semantic-ui-react';
import Column from './Column';

export const LOCAL_STORAGE_STATE_KEY = 'CardManager#state';

// Prioritize hash-based state. If not there, look for storage-based state.
export function retrieveSavedState() {
  try {
    const hash = (location.hash || '').replace('#', '');
    const names = JSON.parse(decodeURIComponent(hash));
    return { cards: names.map(name => ({ name, isPinned: false })) };
  } catch (e) {
    // Ignore error
  }

  try {
    const savedState = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_STATE_KEY)
    );
    if (!savedState || !savedState.cards) {
      throw new Error();
    }
    return savedState;
  } catch (e) {
    return { cards: [] };
  }
}

export default class CardManager extends Component {
  state = { cards: [] };

  componentDidMount() {
    this.setState(retrieveSavedState(), () => (location.hash = ''));
  }

  saveState = () => {
    const stateJson = JSON.stringify(this.state);
    localStorage.setItem(LOCAL_STORAGE_STATE_KEY, stateJson);
  };

  removeCard = name => {
    this.setState(prevState => ({
      cards: prevState.cards.filter(card => card.name !== name),
    }));
  };

  addCard = name => {
    // Prevents the same card being added twice
    if (this.state.cards.findIndex(card => card.name === name) === -1) {
      this.setState(prevState => ({
        cards: prevState.cards.slice().concat({
          name,
          isPinned: false,
        }),
      }));
    }
  };

  pinCard = name => {
    this.setState(prevState => ({
      cards: prevState.cards.map(card => {
        if (card.name !== name) return card;
        return { ...card, isPinned: !card.isPinned };
      }),
    }));
  };

  clearCards() {
    this.setState(prevState => ({
      cards: prevState.cards.filter(card => card.isPinned),
    }));
  }

  componentDidUpdate() {
    this.saveState();
  }

  render() {
    const { cards } = this.state;
    return (
      <Grid stackable padded reversed="mobile">
        {cards.map(({ name, isPinned }) => (
          <Column key={name}>
            <CardResult
              name={name}
              isPinned={isPinned}
              onRequestRemove={() => this.removeCard(name)}
              onRequestPin={() => this.pinCard(name)}
            />
          </Column>
        ))}
        <Column>
          <CardFinder onCardSelected={this.addCard} />
        </Column>
      </Grid>
    );
  }
}
