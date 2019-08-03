// General styles
import layout from './layout';
import text from './text';
import img from './image';

export default {
	// General styles
	...layout,
	text,
	img,

	// Getter function
	get(...paths) {
		return paths.map(path =>
			path.split('.').reduce((acc, step) => {
				if (acc.hasOwnProperty(step)) return acc[step];
				throw new Error(`'${path}' introuvable dans styles, arrêt à ${step}`);
			}, this)
		);
	},
};
