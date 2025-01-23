export const calculateBMR = (weight, height, age, gender) => {
    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
        console.log("Invalid BMR input:", { weight, height, age });
        return NaN;
    }
    
    if (gender === 'male') {
        return parseFloat((88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)).toFixed(2));
    }
    return parseFloat((447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)).toFixed(2));
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

    const tdee = bmr * activityMultipliers[activityLevel];
    return parseFloat(tdee.toFixed(2));
};

export const adjustCaloriesForGoal = (tdee, goal) => {
    switch (goal) {
        case 'lose':
            return Math.round(tdee - 500);
        case 'gain':
            return Math.round(tdee + 500);
        case 'maintain':
        default:
            return Math.round(tdee);
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
            break;
    }

    // Ensure integer values to prevent precision loss
    protein = protein;
    fat = fat;
    carbs = carbs;

    // Check if the results are valid
    if (isNaN(protein) || isNaN(fat) || isNaN(carbs)) {
        console.log("Invalid macros calculation:", { protein, fat, carbs });
        return { protein: 0, fat: 0, carbs: 0 };
    }

    return { protein, fat, carbs };
};
