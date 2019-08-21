/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */
import i18nJs from 'i18n-js';

import en from '../locales/en.json';
import fr from '../locales/fr.json';
import zh from '../locales/zh.json';
import global from '../locales/global.json';

i18nJs.defaultLocale = 'en';
i18nJs.fallbacks = true;
i18nJs.translations = { en, fr, zh, global };

export const getTranslationsFor = (defaultPath, defaultParams = {}) => {
	return (path, params) => {
		return i18nJs.t(`${defaultPath}${path}`, Object.assign(defaultParams, params));
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
export const Words = getTranslationsFor('words.');
export const Global = getTranslationsFor('', { locale: 'global' });
export const Api = getTranslationsFor('api.');
export const AppLoader = getTranslationsFor('screens.AppLoader.');
export const Home = getTranslationsFor('screens.Home.');
export const Refill = getTranslationsFor('screens.Refill.');
export const Payment = getTranslationsFor('screens.Payment.');
export const Transfer = getTranslationsFor('screens.Transfer.');
export const Auth = getTranslationsFor('screens.Auth.');
export const History = getTranslationsFor('screens.History.');
export const Stats = getTranslationsFor('screens.Stats.');
export const Settings = getTranslationsFor('screens.Settings.');
export const About = getTranslationsFor('screens.About.');
export const License = getTranslationsFor('screens.License.');
export const Dependencies = getTranslationsFor('screens.Dependencies.');
export const Contributors = getTranslationsFor('screens.Contributors.');
export const Changelog = getTranslationsFor('screens.Changelog.');
export const Terms = getTranslationsFor('screens.Terms.');
export const Profile = getTranslationsFor('screens.Profile.');
export const Navigation = getTranslationsFor('navigation.');
export const ChangePin = getTranslationsFor('screens.ChangePin.');

const i18n = i18nJs;

export default i18n;
