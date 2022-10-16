import { css }    from 'uebersicht';
import * as Atoms from '../../atoms';

const Controller = ({
	className,
	style,
	onClickPlay,
	onClickStop,
	onClickVolumeUp,
	onClickVolumeDown,
	volume,
}) => {
	return (
		<div
			className = { `${ className ? className : '' } ${baseStyle(style)}`.trim() }
		>
			<div
				className = { edges() }
			/>
			<div
				className = { center() }
			>
				<Atoms.Button.Play
					onClick = { onClickPlay }
				/>
				<Atoms.Button.Stop
					onClick = { onClickStop }
				/>
			</div>
			<div
				className = { edges() }
				style     = {{ alignItems: 'flex-end' }}
			>
				<Atoms.Button.VolumeUp
					style   = {{ marginBottom: '-0.2em !important' }}
					onClick = { onClickVolumeUp }
				/>
				<Atoms.Button.VolumeDown
					style   = {{ marginBottom: '-0.2em !important' }}
					onClick = { onClickVolumeDown }
				/>
				<Atoms.Display
					style       = {{ '& div.screen': { textAlign: 'center' } }}
					description = { `ボリューム` }
				>
					{ volume }
				</Atoms.Display>
			</div>
		</div>
	);
}

const baseStyle = (style) => css`
	display: flex;
	${style}
`;

const edges     = () => css`
	display:         flex;
	justify-content: flex-end;
	flex-grow:       3;
	min-width:       5em;
`;

const center    = () => css`
	display:         flex;
	justify-content: center;
	align-items:     center;
	flex-grow:       4;
`;

export {
	Controller,
};
