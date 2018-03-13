export enum AnalyticKey {
	// Event
	TIME = 'time',
	IP = 'ip',
	// App
	APP_NAME = 'App - Name',
	APP_VERSION = 'App - Version',
	APP_BUILD_TIME = 'App - Build Time',
	APP_GIT_HASH = 'App - Git hash',
	APP_ENVIRONMENT = 'App - Environment',
	APP_PRODUCTION = 'App - Production',
	APP_DEBUG = 'App - Debug',
	// User
	DISTINCT_ID = 'distinct_id',
	SESSION_ID = 'Session - Id',
	// Operating System
	OS_NAME = '$os',
	OS_VERSION = '$os_version',
	OS_VERSION_FULL = 'Operating System Version - Full',
	// Device
	DEVICE_NAME = '$device',
	DEVICE_TYPE = 'Device Type',
	DEVICE_ORIENTATION = 'Device Orientation',
	DEVICE_SCREEN_WIDTH = '$screen_width',
	DEVICE_SCREEN_HEIGHT = '$screen_height',
	// Browser
	BROWSER_NAME = '$browser',
	BROWSER_VERSION = '$browser_version',
	BROWSER_VERSION_FULL = 'Browser Version - Full',
	BROWSER_USER_AGENT = 'Browser - User Agent',
	BROWSER_CONNECTION_TYPE = 'Browser - Connection - Type',
	BROWSER_CONNECTION_EFFECTIVE_TYPE = 'Browser - Connection - Effective - Type',
	BROWSER_URL = '$current_url',
	BROWSER_DOMAIN = 'Current Domain',
	BROWSER_FULLSCREEN = 'Browser - Fullscreen',
	BROWSER_NAVIGATION_TYPE = 'Browser - Navigation Type',
	BROWSER_ONLINE = 'Browser - Online',
	BROWSER_WINDOW_WIDTH = 'Browser - Window Width',
	BROWSER_WINDOW_HEIGHT = 'Browser - Window Height',
	// Referrers
	INITIAL_REFERRER_URL = '$initial_referrer',
	INITIAL_REFERRER_DOMAIN = '$initial_referring_domain',
	REFERRER_URL = '$referrer',
	REFERRER_DOMAIN = '$referring_domain',
	REFERRER_TYPE_ID = 'Referrer - Type- Id',
	REFERRER_TYPE_VALUE = 'Referrer - Type - Value'
}
