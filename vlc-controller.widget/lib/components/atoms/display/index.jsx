import { css }  from 'uebersicht';

const Display = ({ className, style, description, children }) => {
	return (
		<div className = { `${className ? className : ''} ${getStyle(style)}`.trim() }>
			{
				description ? (
					<div className = 'description'>{ description }</div>
				) : `` 
			}
			<div className = 'screen'>
				{ children }
			</div>
		</div>
	);
}

const getStyle = (style) => css`
	& div.description {
		font-size: 0.1em;
	}

	& div.screen {
		position:    relative;
		color:       rgba(244,251,254,.8);
		padding:     0.2em;
		min-height:  1.5em;
		line-height: 1.5em;
		outline:     1px solid rgba(93,93,99,.9);
	
		&:after {
			content:          '';
			position:         absolute;
			top:              0;
			left:             0;
			width:            100%;
			height:           100%;
			background-image: radial-gradient(transparent 0 1px, rgba(0,0,0,.7) 1px);
			background-size:  2px 2px;
		}
	}

	${style}
`;

export {
	Display,
};
