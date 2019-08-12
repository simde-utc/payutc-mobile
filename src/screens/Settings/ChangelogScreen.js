/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import BlockTemplate from '../../components/BlockTemplate';
import List from '../../components/List';
import colors from '../../styles/colors';
import { Changelog as t } from '../../utils/i18n';
import fr from '../../changelogs/fr';
import en from '../../changelogs/en';

const CHANGELOGS = {
	fr,
	en,
};

class ChangelogScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
	});

	static renderItem(item, index) {
		if (item.title && item.data) {
			const { title, data } = item;

			return (
				<>
					{ChangelogScreen.renderItem(title, index)}
					<View
						style={{
							borderLeftWidth: 1,
							borderColor: colors.backgroundLight,
							backgroundColor: colors.backgroundBlock,
							paddingLeft: '2.5%',
						}}
					>
						<List
							items={data}
							keyExtractor={item => `${title}.${item.title || item}`}
							renderItem={ChangelogScreen.renderItem}
						/>
					</View>
				</>
			);
		}

		return (
			<BlockTemplate
				customBackground={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				roundedTop={index === -1}
			>
				<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
					{index === -1 ? '' : '- '}
					{item}
				</Text>
			</BlockTemplate>
		);
	}

	render() {
		const { lang } = this.props;
		const changelog = CHANGELOGS[lang];

		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<View style={{ padding: 15 }}>
					<BlockTemplate roundedTop roundedBottom shadow style={{ marginBottom: 15 }}>
						<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
							{t('title')}
						</Text>
					</BlockTemplate>
					<FlatList
						data={Object.keys(changelog)}
						keyExtractor={version => version}
						renderItem={({ item: version }) => (
							<>
								{ChangelogScreen.renderItem({ title: version, data: changelog[version] }, -1)}
								<BlockTemplate
									backgroundColor={
										changelog[version].length % 2 === 0
											? colors.backgroundBlock
											: colors.backgroundBlockAlt
									}
									roundedBottom
								/>
							</>
						)}
						ItemSeparatorComponent={<View style={{ height: 15 }} />}
					/>
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ config: { lang } }) => ({ lang });

export default connect(mapStateToProps)(ChangelogScreen);
