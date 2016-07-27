interface IVkRequest {
		v?: string;
		access_token?: string;
		[key: string]: any;
}

interface IVkResponse {
	data: IVkResponseSuccess | IVkResponseError;
}

interface IVkResponseSuccess {
    response: {
			[key:string]: any;
		};
}

interface IVkResponseError {
    error: {
			error_code: number;
			error_msg: string;
		}
}

declare type IVkAuth = IVkAuthSuccess | IVkAuthError;

interface IVkAuthSuccess {
	state?: string;
	user_id: string;
	expires_in: string;
	access_token: string;
}

interface IVkAuthError {
	error: string;
	error_description: string;
}
