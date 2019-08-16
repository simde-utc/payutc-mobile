/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BlockTemplate from '../BlockTemplate';
import colors from '../../styles/colors';
import { Dependencies as t } from '../../utils/i18n';

const NPM_PACKAGE_URL = 'https://www.npmjs.com/package';

export default function Dependency({ dependency, backgroundColor, roundedBottom }) {
	const description = t(`descriptions.${dependency}`, { defaultValue: '' });

	return (
		<BlockTemplate
			customBackground={backgroundColor}
			roundedBottom={roundedBottom}
			onPress={() => Linking.openURL(`${NPM_PACKAGE_URL}/${dependency}`)}
		>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<View>
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.secondary }}>
						{dependency}
					</Text>
					{description ? (
						<Text style={{ fontSize: 10, color: colors.secondary }}>{description}</Text>
					) : null}
				</View>
				<FontAwesomeIcon icon={['fas', 'angle-right']} size={20} color={colors.secondary} />
			</View>
		</BlockTemplate>
	);
}
