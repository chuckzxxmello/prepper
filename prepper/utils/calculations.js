export const calculateBMR = (weight, height, age, gender) => {
    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
        console.log("Invalid BMR input:", { weight, height, age });
        return NaN;
    }
    
    if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
};

export const calculateTDEE = (bmr, activityLevel) => {
    // Check for invalid BMR or activity level
    if (isNaN(bmr)) {
        console.log("Invalid BMR value:", bmr);
        return NaN;
    }
    
    if (!activityLevel || !['sedentary', 'light', 'moderate', 'active', 'veryActive'].includes(activityLevel)) {
        console.log("Invalid activity level:", activityLevel);
        return NaN;
    }

    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
    };

    const multiplier = activityMultipliers[activityLevel];
    return Math.round(bmr * multiplier);
};

export const adjustCaloriesForGoal = (tdee, goal) => {
    // Ensure TDEE is valid
    if (isNaN(tdee)) {
        console.log("Invalid TDEE value:", tdee);
        return NaN;
    }

    // Validate goal input
    if (!['lose', 'gain', 'maintain'].includes(goal)) {
        console.log("Invalid goal value:", goal);
        return NaN;
    }

    switch (goal) {
        case 'lose':
            return Math.round(tdee - 500);
        case 'gain':
            return Math.round(tdee + 500);
        default:
            return Math.round(tdee); // maintain
    }
};

export const calculateMacros = (calories, weight, goal) => {
    // Ensure valid inputs
    if (isNaN(calories) || isNaN(weight)) {
        console.log("Invalid calories or weight:", { calories, weight });
        return { protein: 0, fat: 0, carbs: 0 };
    }

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

    // Check if the results are valid
    if (isNaN(protein) || isNaN(fat) || isNaN(carbs)) {
        console.log("Invalid macros calculation:", { protein, fat, carbs });
        return { protein: 0, fat: 0, carbs: 0 };
    }

    return { protein, fat, carbs };
};
