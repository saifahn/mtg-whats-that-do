import { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Menu, Responsive } from 'semantic-ui-react';
import FindACardButton from './FindACardButton';

export default class MainHeader extends Component {
  static propTypes = {
    onClearCards: PropTypes.func.isRequired,
    onOpenShareModal: PropTypes.func.isRequired,
    onOpenSidebar: PropTypes.func.isRequired,
    onOpenShortcutsModal: PropTypes.func.isRequired,
    onOpenCardFinderModal: PropTypes.func.isRequired,
  };

  state = {
    isInitialized: false,
  };

  componentDidMount() {
    this.setState({ isInitialized: true });
  }

  render() {
    const {
      onOpenSidebar,
      onClearCards,
      onOpenShareModal,
      onOpenShortcutsModal,
      onOpenCardFinderModal,
    } = this.props;
    const { isInitialized } = this.state;
    return (
      <Header
        as="h1"
        block
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            flex: 1,
          }}
        >
          {"What's that do?"}
        </span>

        {isInitialized && <FindACardButton onClick={onOpenCardFinderModal} />}

        <Responsive maxWidth={767}>
          <Menu
            size="tiny"
            style={{
              margin: 0,
            }}
          >
            <Menu.Item name="Menu" onClick={onOpenSidebar} />
          </Menu>
        </Responsive>
        <Responsive minWidth={768}>
          <Menu
            size="tiny"
            style={{
              margin: 0,
            }}
          >
            <Menu.Item as="a" name="Share link" onClick={onOpenShareModal} />
            <Menu.Item as="a" name="Clear cards" onClick={onClearCards} />
            <Menu.Item as="a" name="Shortcuts" onClick={onOpenShortcutsModal} />
            <Menu.Item
              as="a"
              href="https://github.com/ahaurw01/mtg-whats-that-do/issues"
              target="_blank"
              name="feedback"
            />
          </Menu>
        </Responsive>
      </Header>
    );
  }
}
