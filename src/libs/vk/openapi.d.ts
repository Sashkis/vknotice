declare interface IOpenApiInitOptions {
	apiId: number;
	status?: boolean;
	onlyWidgets?:boolean;
}

declare interface IOpenApi_Session {}

declare interface IOpenApiAuth {
	getLoginStatus: (cb : (resp: {session: any, status: string}) => void, force: boolean) => void;
	getSession: () => IOpenApi_Session
}
declare interface IOpenApi {
    _protocol: string;
		_rootId: string;
		_session: IOpenApi_Session;
		_userStatus: string;
		xdReady: boolean;
		version: number;

		init: (options: IOpenApiInitOptions) => void;
		Widgets: any;
}

declare var VK: IOpenApi;
