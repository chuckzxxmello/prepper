export const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
};

export const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
    };
    return Math.round(bmr * activityMultipliers[activityLevel]);
};

export const adjustCaloriesForGoal = (tdee, goal) => {
    switch (goal) {
        case 'lose':
            return Math.round(tdee - 500);
        case 'gain':
            return Math.round(tdee + 500);
        default:
            return Math.round(tdee);
    }
};

export const calculateMacros = (calories, weight, goal) => {
    let protein, fat, carbs;

    switch (goal) {
        case 'lose':
            protein = Math.round(weight * 2.2);
            fat = Math.round((calories * 0.25) / 9);
            carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
            break;
        case 'gain':
            protein = Math.round(weight * 1.8);
            fat = Math.round((calories * 0.3) / 9);
            carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
            break;
        default:
            protein = Math.round(weight * 2);
            fat = Math.round((calories * 0.25) / 9);
            carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
    }

    return { protein, fat, carbs };
};
