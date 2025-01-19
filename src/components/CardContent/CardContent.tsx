import React from 'react'
import { CardContentProps } from '../../types'
import style from './CardContent.module.css'

export const CardContent: React.FC<CardContentProps> = ({
	word,
	options,
	onAnswerClick,
}) => {
	return (
		<div className={style.cardContent}>
			<h3 className={style.contentText}>{word}</h3>
			<ul className={style.cartOptions}>
				{options.map(option => (
					<li
						key={option}
						onClick={() => onAnswerClick(option)}
						className={style.chooseOption}
					>
						{option}
					</li>
				))}
			</ul>
		</div>
	)
}
