import { TextField } from '@mui/material'
import React, { useState } from 'react'
import { CardContentProps } from '../../types'
import style from './CardContent.module.css'

export const CardContent: React.FC<CardContentProps> = ({
	word,
	options,
	onAnswerClick,
	type,
	correctAnswer,
}) => {
	const [inputValue, setInputValue] = useState('')

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && inputValue.trim()) {
			onAnswerClick(inputValue.trim())
			setInputValue('')
		}
	}

	return (
		<div className={style.cardContent}>
			<h3 className={style.contentText}>
				{type === 'fill-in-the-blank' && word.includes('___')
					? word.split('___').map((part, index) => (
							<React.Fragment key={index}>
								<span>{part}</span>
								{index < word.split('___').length - 1 && (
									<TextField
										variant='standard'
										size='small'
										value={inputValue}
										onChange={handleInputChange}
										onKeyPress={handleKeyPress}
										InputProps={{
											disableUnderline: false,
										}}
										sx={{
											display: 'inline-block',
											minWidth: '100px',
											width: `${Math.min(
												Math.max(inputValue.length * 10, 100),
												200
											)}px`,
											maxWidth: '200px',
											margin: '0 4px',
											fontSize: 'inherit',
											textAlign: 'center',
											'& .MuiInputBase-input': {
												padding: 0,
												textAlign: 'center',
												height: 'auto',
												lineHeight: '1.2',
												fontSize: 'clamp(20px, 5vw, 36px)',
											},
											'& .MuiInput-underline:before': {
												borderBottomColor: 'rgba(0, 0, 0, 0.42)', // Стандартный цвет
											},
											'& .MuiInput-underline:hover:before': {
												borderBottomColor: 'purple', // Цвет при наведении
											},
											'& .MuiInput-underline:after': {
												borderBottomColor: 'purple', // Цвет при фокусе
											},
										}}
									/>
								)}
							</React.Fragment>
					  ))
					: word}
			</h3>
			{type !== 'fill-in-the-blank' && (
				<ul className={style.cardOptions}>
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
			)}
		</div>
	)
}
