import {
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { SettingsScreenProps } from '../../types'
import { useGame } from '../context/GameContext'
import style from './StartScreen.module.css'

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
	onConfirm,
}) => {
	const { startGame } = useGame()
	const [levels, setLevels] = useState<string[]>([])
	const [complexities, setComplexities] = useState<string[]>([])
	const [selectedLevel, setSelectedLevel] = useState<string>('')
	const [selectedComplexity, setSelectedComplexity] = useState<string>('')
	const [loadingLevels, setLoadingLevels] = useState(false)
	const [loadingComplexities, setLoadingComplexities] = useState(false)
	const didFetch = useRef(false)

	useEffect(() => {
		if (didFetch.current) return
		didFetch.current = true

		const fetchLevels = async () => {
			try {
				setLoadingLevels(true)
				const response = await axios.get('http://localhost:3001/api/levels')
				setLevels(response.data)
			} catch (error) {
				console.error('Error fetching levels:', error)
			} finally {
				setLoadingLevels(false)
			}
		}

		fetchLevels()
	}, [])

	useEffect(() => {
		if (!selectedLevel) return

		const fetchComplexities = async () => {
			setLoadingComplexities(true)
			try {
				const response = await axios.post(
					'http://localhost:3001/api/complexities',
					{
						level: selectedLevel,
					}
				)
				const extraOptions = ['Je prendrai le risque', 'Mot du jour']
				setComplexities([...response.data, ...extraOptions])
			} catch (error) {
				console.error('Error fetching complexities:', error)
			} finally {
				setLoadingComplexities(false)
			}
		}

		fetchComplexities()
	}, [selectedLevel])

	const handleConfirm = async () => {
		if (selectedComplexity === 'Je prendrai le risque') {
			await startGame(selectedLevel, 'risk')
		} else if (selectedComplexity === 'Mot du jour') {
			await startGame(selectedLevel, 'mot-du-jour')
		} else {
			await startGame(selectedLevel, selectedComplexity)
		}
		onConfirm({ level: selectedLevel, complexity: selectedComplexity })
	}

	return (
		<div className={style.settingsScreen}>
			<h2>Choose your settings</h2>
			<div className={style.dropdown}>
				<FormControl fullWidth margin='normal' disabled={loadingLevels}>
					<InputLabel id='level-label'>Select Level</InputLabel>
					<Select
						labelId='level-label'
						value={selectedLevel}
						onChange={e => {
							setSelectedLevel(e.target.value)
							setSelectedComplexity('')
						}}
					>
						{loadingLevels ? (
							<MenuItem value=''>
								<CircularProgress size={20} />
							</MenuItem>
						) : (
							levels.map(level => (
								<MenuItem key={level} value={level}>
									{level}
								</MenuItem>
							))
						)}
					</Select>
				</FormControl>
			</div>
			{selectedLevel && (
				<div className={style.dropdown}>
					<FormControl fullWidth margin='normal' disabled={loadingComplexities}>
						<InputLabel id='complexity-label'>Select Complexity</InputLabel>
						<Select
							labelId='complexity-label'
							value={selectedComplexity}
							onChange={e => setSelectedComplexity(e.target.value)}
						>
							{loadingComplexities ? (
								<MenuItem value=''>
									<CircularProgress size={20} />
								</MenuItem>
							) : (
								complexities.map(complexity => (
									<MenuItem key={complexity} value={complexity}>
										{complexity}
									</MenuItem>
								))
							)}
						</Select>
					</FormControl>
				</div>
			)}
			{selectedLevel && (
				<Button variant='contained' color='primary' onClick={handleConfirm}>
					OK
				</Button>
			)}
		</div>
	)
}
