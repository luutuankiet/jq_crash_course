import { RECIPES } from '../recipes';
import { executeJq } from '../services/jqService';
import isEqual from 'lodash/isEqual';

// Simple test runner to be executed in the browser console or via a hidden UI
export const runRecipeTests = async () => {
    console.log("🚀 Starting Recipe Tests...");
    let passed = 0;
    let failed = 0;
    const failures: any[] = [];

    for (const recipe of RECIPES) {
        try {
            const result = await executeJq(recipe.input, recipe.query);
            // We don't have "expected output" stored in recipes, so we mainly check for runtime errors
            // and basic validity. 
            // Ideally, we would store expected output in recipes.ts, but for now, 
            // just ensuring they run without error is a huge win.

            // Special check for the SQL one that was failing
            if (recipe.id === 'adv-generate-sql') {
                if (!result.includes("INSERT INTO")) {
                    throw new Error("SQL Output does not contain INSERT INTO");
                }
            }

            passed++;
        } catch (e: any) {
            failed++;
            failures.push({ id: recipe.id, title: recipe.title, error: e.message });
            console.error(`❌ Failed: ${recipe.title} (${recipe.id})`, e);
        }
    }

    console.log(`\n✨ Test Complete: ${passed} Passed, ${failed} Failed`);
    if (failures.length > 0) {
        console.table(failures);
    }
    return { passed, failed, failures };
};
