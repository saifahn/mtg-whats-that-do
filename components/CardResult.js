import { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Segment, Icon } from 'semantic-ui-react';
import RulingsModal from './RulingsModal';
import OracleModal from './OracleModal';
import { getImageSources, isDoubleFaced } from '../utils/card-data';
import CardImage from './CardImage';
import cx from 'classnames';
import Presser from '../utils/presser';
import styles from './CardResult.css';

export default class CardResult extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onRequestRemove: PropTypes.func.isRequired,
    onRequestPin: PropTypes.func.isRequired,
    isPinned: PropTypes.bool.isRequired,
    isFocused: PropTypes.bool,
  };

  static defaultProps = {
    isFocused: false,
  };

  state = {
    card: null,
    rulings: [],
    faceIndex: 0,
    isOracleModalOpen: false,
    isRulingsModalOpen: false,
  };

  componentDidMount() {
    const { name } = this.props;
    fetch(
      `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`
    )
      .then(result => result.json())
      .then(card => {
        this.setState({ card });
        return fetch(card.rulings_uri);
      })
      .then(result => result.json())
      .then(result =>
        this.setState({
          rulings: result.data,
        })
      );

    this.presser = new Presser();
    this.presser.on('remove', () => {
      if (this.props.isFocused) this.props.onRequestRemove();
    });
    this.presser.on('pin', () => {
      if (this.props.isFocused) this.props.onRequestPin();
    });
    this.presser.on('oracle', () => {
      if (this.props.isFocused && this.state.card) {
        this.closeRulingsModal();
        this.openOracleModal();
      }
    });
    this.presser.on('rulings', () => {
      if (
        this.props.isFocused &&
        this.state.rulings &&
        this.state.rulings.length
      ) {
        this.closeOracleModal();
        this.openRulingsModal();
      }
    });
    this.presser.on('flip', () => {
      if (this.props.isFocused && isDoubleFaced(this.state.card)) {
        this.flip();
      }
    });
  }

  componentWillUnmount() {
    this.presser.off();
  }

  flip = () => {
    this.setState(({ faceIndex }) => ({
      faceIndex: (faceIndex + 1) % 2,
    }));
  };

  openOracleModal = () => {
    this.setState({ isOracleModalOpen: true });
  };

  closeOracleModal = () => {
    this.setState({ isOracleModalOpen: false });
  };

  openRulingsModal = () => {
    this.setState({ isRulingsModalOpen: true });
  };

  closeRulingsModal = () => {
    this.setState({ isRulingsModalOpen: false });
  };

  render() {
    const {
      card,
      rulings,
      faceIndex,
      isOracleModalOpen,
      isRulingsModalOpen,
    } = this.state;
    const { onRequestRemove, onRequestPin, isPinned, isFocused } = this.props;
    const imageSources = getImageSources(card);
    return (
      <Segment className={cx({ [styles.cardIsFocused]: isFocused })}>
        <CardImage sources={imageSources} indexShowing={faceIndex} />
        <div className={styles.actions}>
          <Button.Group>
            {card && (
              <Button
                icon
                primary
                title="Oracle"
                onClick={this.openOracleModal}
              >
                <Icon name="info" />
              </Button>
            )}
            {card && (
              <Button
                icon
                secondary
                disabled={!rulings.length}
                title="Rulings"
                onClick={this.openRulingsModal}
              >
                <Icon name="legal" />
              </Button>
            )}
            <Button icon onClick={onRequestRemove}>
              <Icon name="trash" />
            </Button>
            <Button icon toggle active={isPinned} onClick={onRequestPin}>
              <Icon name="pin" />
            </Button>
            {isDoubleFaced(card) && (
              <Button icon onClick={this.flip}>
                <Icon name="refresh" />
              </Button>
            )}
          </Button.Group>
        </div>

        {card && (
          <OracleModal
            card={card}
            isOpen={isOracleModalOpen}
            onClose={this.closeOracleModal}
          />
        )}
        {card && (
          <RulingsModal
            card={card}
            rulings={rulings}
            isOpen={isRulingsModalOpen}
            onClose={this.closeRulingsModal}
          />
        )}
      </Segment>
    );
  }
}
