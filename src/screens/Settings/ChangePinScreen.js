/**
 * @author Aymeric Obled <aymeric.obled@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import PinForm from '../../components/ChangePin/PinForm';
import LinkButton from '../../components/LinkButton';
import colors from '../../styles/colors';
import { Config, PayUTC } from '../../redux/actions';
import { _, ChangePin as t } from '../../utils/i18n';

class ChangePinScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: {
			borderBottomWidth: 0,
			backgroundColor: colors.backgroundBlock,
		},
		headerTintColor: colors.primary,
		headerForceInset: { top: 'never' },
		headerTruncatedBackTitle: _('back'),
	});

	submiting = false;

	constructor(props) {
		super(props);

		this.state = {
			pin: '',
		};

		this.handlePinChange = this.handlePinChange.bind(this);
	}

	handlePinChange(text) {
		this.setState({ pin: text });
	}

	isButtonDisabled() {
		const { pin } = this.state;

		return pin.length !== 4;
	}

	refuse() {
		const { dispatch } = this.props;

		dispatch(
			Config.spinner({
				visible: false,
			})
		);

		this.submiting = false;
	}

	submit() {
		const { dispatch, navigation } = this.props;
		const { pin } = this.state;

		// Avoid multiple sumbits on laggy phones...
		if (this.submiting) {
			return;
		}

		this.submiting = true;

		dispatch(
			Config.spinner({
				visible: true,
				textContent: t('modification_checks'),
			})
		);

		PayUTC.setPin(pin)
			.payload.then(() => {
				dispatch(
					Config.spinner({
						visible: false,
					})
				);

				this.submiting = false;

				navigation.navigate('Profile', {
					title: t('modification_confirmed'),
					tintColor: colors.secondary,
				});
			})
			.catch(() => this.refuse());
	}

	render() {
		const { pin } = this.state;

		return (
			<ScrollView style={{ backgroundColor: colors.background }}>
				<View style={{ padding: 15 }}>
					<PinForm pin={pin} onChange={this.handlePinChange} />
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<LinkButton
						text={t('modify')}
						color={colors.background}
						backgroundColor={colors.primary}
						disabled={this.isButtonDisabled()}
						onPress={() => this.submit()}
					/>
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const suggestions = payutc.getUserAutoComplete();
	const history = payutc.getHistory();

	return {
		suggestions: suggestions.getData([]),
		suggestionsFetching: suggestions.isFetching(),
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
	};
};

export default connect(mapStateToProps)(ChangePinScreen);
