/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import layout from './layout';
import text from './text';
import img from './image';

export default {
	...layout,
	text,
	img,

	get(...paths) {
		return paths.map(path =>
			path.split('.').reduce((acc, step) => {
				if (acc.hasOwnProperty(step)) return acc[step];
				throw new Error(`'${path}' introuvable dans styles, arrêt à ${step}`);
			}, this)
		);
	},
};
