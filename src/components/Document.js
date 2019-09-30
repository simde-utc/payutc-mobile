/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { WebView } from 'react-native';

export default function Document({ document, lang }) {
	return (
		<WebView
			style={{ backgroundColor: 'transparent' }}
			useWebKit
			source={{
				html: `<!DOCTYPE html><html lang="${lang ||
					'en'}"><head><meta charset="utf-8"/></head><body><p style='font-family: sans-serif; text-align: justify; white-space: pre-wrap;'>${document}</p></body></html>`,
			}}
		/>
	);
}
