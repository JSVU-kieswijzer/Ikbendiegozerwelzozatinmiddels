
function calculateMatch(student, firms) {
  return firms
    .map((firm) => {
      let totalScore = 0;
      let maxScore = 0;

      for (let i = 0; i < student.length; i++) {
        const studentAnswer = student[i].answers || [];
        const firmAnswer = firm.answers[i] || [];
        const calculationType = student[i].calculation || [];
        const options = student[i].options || [];

        let score = 0;

        if (calculationType === 'multiple') {
          const overlap = studentAnswer.filter((answer) => firmAnswer.includes(answer)).length;
          const totalPossible = new Set([...studentAnswer, ...firmAnswer]).size;
          score = totalPossible > 0 ? (overlap / totalPossible) * 100 : 0;
          totalScore += score;
          maxScore += 100;
        } else if (calculationType === 'weighted') {
          const weightScale = Object.fromEntries(options.map((opt, index) => [opt, index + 1]));
          const maxDifference = options.length - 1;

          if (studentAnswer.length > 0 && firmAnswer.length > 0) {
            if (weightScale[studentAnswer[0]] && weightScale[firmAnswer[0]]) {
              const difference = Math.abs(weightScale[studentAnswer[0]] - weightScale[firmAnswer[0]]);
              score = 100 - (difference / maxDifference) * 100;
            }
          }
          totalScore += score;
          maxScore += 100;
        } else if (calculationType === 'exact') {
          score = JSON.stringify(studentAnswer) === JSON.stringify(firmAnswer) ? 100 : 0;
          totalScore += score;
          maxScore += 100;
        }
      }

      const matchPercentage = maxScore > 0 ? Number(((totalScore / maxScore) * 100).toPrecision(6)) : 0;

      return {
        firm: firm.name,
        score: matchPercentage,
      };
    })
    .sort((a, b) => b.score - a.score);
}
