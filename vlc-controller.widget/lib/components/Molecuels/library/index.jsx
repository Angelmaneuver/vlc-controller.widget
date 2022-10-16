import { css }    from 'uebersicht';
import * as Atoms from '../../atoms';

const Library = ({
	className,
	style,
	children,
	onClickLeft,
	onClickRight,
}) => {
	return (
		<div
			className = { `${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			<Atoms.Button.Left
				onClick     = { onClickLeft }
				style       = {{ '&:before': { content: `''`, fontSize: '0.1em' } }}
			/>
			<Atoms.Display
				description = { 'ライブラリ' }
				style       = {{ 'flexGrow': '9' }}
			>
				{ children }
			</Atoms.Display>
			<Atoms.Button.Right
				onClick     = { onClickRight }
				style       = {{ '&:before': { content: `''`, fontSize: '0.1em' } }}
			/>
		</div>
	);
}

const baseStyle = (style) => css`
	display: flex;
	${style}
`;

export {
	Library,
};
