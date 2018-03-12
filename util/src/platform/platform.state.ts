// Libs
import { State } from '@seed/interfaces';
import {
	DeviceType,
	OperatingSystem,
	Browser,
	RenderingMode
} from '@seed/enums';

export class PlatformState extends State {
	static readonly STORE_NAME = 'platform';

	/**
	 * Rendering Mode
	 */
	renderingMode: RenderingMode;

	/** Online */
	online: boolean;

	/**
	 * Navigation Type
	 */
	navigationType: string;

	/**
	 * Device Name
	 */
	deviceName: string | 'iPhone' | 'iPod' | 'iPad';

	/**
	 * Device Type
	 */
	deviceType: DeviceType;

	/**
	 * Operating System
	 */
	operatingSystem: OperatingSystem;

	/**
	 * Browser
	 */
	browser: Browser;

	// ### VERSIONS ###

	/**
	 * OS Version
	 */
	operatingSystemVersion: string;

	/**
	 * Browser Version
	 */
	browserVersion: string;

	// ### Referrers ###

	/**
	 * Initial Referrer
	 */
	initialReferrer: string;

	/**
	 * Initial Referrer Domain
	 */
	initialReferrerDomain: string;

	// ### Browser ###

	/**
	 * User Agent
	 */
	userAgent: string;

	/**
	 * Connection Type
	 */
	connectionType: string;

	/**
	 * Connection Effective Type
	 */
	connectionEffectiveType: string;
}
