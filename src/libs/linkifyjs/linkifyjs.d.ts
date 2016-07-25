declare namespace linkify {

	type filterFunction = (href: string, type: string) => string;

	interface options {
	  defaultProtocol?: string,
		events?: Object,
	  format?: filterFunction,
		formatHref?: filterFunction,
		ignoreTags?: string[],
		linkAttributes?: string | filterFunction,
		linkClass?: string | filterFunction,
		nl2br?: boolean,
		tagName?: string | filterFunction,
		target?: string | filterFunction,
		validate?: filterFunction,
	}
}

declare var linkifyStr: (str: string, options?: linkify.options) => string;
