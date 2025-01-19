function normalizeAnswer(answer) {
	return answer
		.toLowerCase()
		.split(' ')
		.filter(word => word.trim() !== '')
		.sort()
		.join(' ')
}

module.exports = normalizeAnswer
