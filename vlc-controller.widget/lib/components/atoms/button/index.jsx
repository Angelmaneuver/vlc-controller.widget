import { css } from 'uebersicht';

const Button     = ({ className, onClick, children }) => {
	return (
		<div
			className = { className }
			onClick   = { onClick }
		>
			{ children }
		</div>
	);
}

const Left       = ({ className, style, onClick }) => {
	return (
		<Button
			className = { `${ className ? className : '' } ${ changeChannelStyle(style) }`.trim() }
			onClick   = { onClick }
		>
			{ '<' }
		</Button>
	);
}

const Right      = ({ className, style, onClick }) => {
	return (
		<Button
			className = { `${ className ? className : '' } ${ changeChannelStyle(style) }`.trim() }
			onClick   = { onClick }
		>
			{ '>' }
		</Button>
	);
}

const Play       = ({ className, style, onClick }) => {
	return (
		<Button
			className = { `${ className ? className : '' } icono-play ${ playChannelStyle(style) }`.trim() }
			onClick   = { onClick }
		/>
	);
}

const Stop       = ({ className, style, onClick }) => {
	return (
		<Button
			className = { `${ className ? className : '' } icono-stop ${ stopChannelStyle(style) }`.trim() }
			onClick   = { onClick }
		/>
	);
}

const VolumeUp   =  ({ className, style, onClick }) => {
	return (
		<Button
			className = { `${ className ? className : '' } icono-volumeIncrease ${ volumeStyle(style) }`.trim() }
			onClick   = { onClick }
		/>
	);
}

const VolumeDown =  ({ className, style, onClick }) => {
	return (
		<Button
			className = { `${ className ? className : '' } icono-volumeDecrease ${ volumeStyle(style) }`.trim() }
			onClick   = { onClick }
		/>
	);
}

const baseStyle = () => css`
	display:     grid;
	place-items: center;
	user-select: none;
	cursor:      pointer;
`;

const changeChannelStyle = (style) => css`
	${baseStyle()}
	width:       1.5em;
	height:      auto;
	font-weight: 700;
	text-shadow: #00BFFF 0.1em  0.1em 1em, #00BFFF -0.1em  0.1em 1em,
				 #00BFFF 0.1em -0.1em 1em, #00BFFF -0.1em -0.1em 1em;
	${style}
`;

const playChannelStyle   = (style) => css`
	${baseStyle()}
	transform: scale(0.7);
	filter:    drop-shadow(0 0 0.5em #00FF7F);
	${style}
`;

const stopChannelStyle   = (style) => css`
	${baseStyle()}
	transform: scale(0.7);
	filter:    drop-shadow(0 0 0.5em #DC143C);
	${style}
`;

const volumeStyle        = (style) => css`
	${baseStyle()}
	transform: scale(0.5);
	filter:    drop-shadow(0 0 0.5em #00BFFF);
	${style}
`;

export {
	Left,
	Right,
	Play,
	Stop,
	VolumeUp,
	VolumeDown,
};
