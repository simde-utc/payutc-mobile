/*
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */
import i18nJs from 'i18n-js';

import fr from '../local/fr.json';

i18nJs.defaultLocale = 'fr';
i18nJs.fallbacks = true;
i18nJs.translations = { fr };

export const getTranslationsFor = defaultPath => {
	return (path, params) => {
		return i18nJs.t(`${defaultPath}.${path}`, params);
	};
};

// Retourne un texte avec son premier caractère en majuscule.
export const T = (path, params) => {
	const string = i18nJs.t(path, params);

	return string.charAt(0).toUpperCase() + string.slice(1);
};

// Retourne un mot avec son premier caractère en majuscule.
export const _ = (path, params) => {
	return T(`words.${path}`, params);
};

// Retourne un mot avec son premier caractère en majuscule.
export const e = (path, params) => {
	return i18nJs.t(`errors.${path}`, params);
};

// Liste des screens avec des traductions.
export const Home = getTranslationsFor('screens.Home');
export const Refill = getTranslationsFor('screens.Refill');
export const Transfer = getTranslationsFor('screens.Transfer');

const i18n = {
	...i18nJs,
	getTranslationsFor,
	T,
	_,
	e,
};

export default i18n;
