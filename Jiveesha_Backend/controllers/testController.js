// const Test = require('../models/test');
// const Child = require('../models/child');

// exports.addTest = async (req, res) => {
//     const { childId, test_name, reading_age, score, correctWords, incorrectWords } = req.body; // Add correctWords and incorrectWords to the body

//     try {
//         const test = new Test({
//             child_id: childId,
//             test_name,
//             reading_age,
//             score,
//             correct_words: correctWords,  // Assuming you want to store these as well
//             incorrect_words: incorrectWords,  // Assuming you want to store these as well
//         });
//         await test.save();

//         // Increment the number of tests taken by the child
//         await Child.findByIdAndUpdate(childId, {
//             $inc: { tests_taken: 1 }
//         });

//         res.status(201).json({ message: 'Test added successfully', test });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };


// // Get all tests for a specific child
// exports.getTestsByChild = async (req, res) => {
//     const { childId } = req.params;

//     try {
//         const tests = await Test.find({ child_id: childId });
//         res.status(200).json({ tests });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };


// const Joi = require('joi');
// const Test = require('../models/test');
// const Child = require('../models/child');

// // Define validation schema using Joi
// const testSchema = Joi.object({
//   childId: Joi.string().required(),
//   test_name: Joi.string().required(),
//   reading_age: Joi.string().required(),
//   score: Joi.number().required(),
//   correctWords: Joi.array().items(Joi.string()).required(),
//   incorrectWords: Joi.array().items(Joi.string()).required(),
// });

// // Add Test API
// exports.addTest = async (req, res) => {
//   // Validate the request body
//   const { error } = testSchema.validate(req.body);
//   if (error) {
//     console.error('Validation error:', error.details[0].message);
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   const { childId, test_name, reading_age, score, correctWords, incorrectWords } = req.body;

//   try {
//     // Create a new test instance
//     const test = new Test({
//       child_id: childId,
//       test_name,
//       reading_age,
//       score,
//       correct_words: correctWords,
//       incorrect_words: incorrectWords,
//     });

//     // Save the test to the database
//     await test.save();
//     console.log('Test saved successfully:', test);

//     // Increment the number of tests taken by the child
//     const child = await Child.findByIdAndUpdate(childId, { $inc: { tests_taken: 1 } });
//     if (!child) {
//       console.error('Child not found:', childId);
//       return res.status(404).json({ message: 'Child not found' });
//     }
//     console.log('Child test count incremented:', child);

//     // Respond with success
//     res.status(201).json({ message: 'Test added successfully', test });
//   } catch (error) {
//     console.error('Error adding test:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// // Get all tests for a specific child
// exports.getTestsByChild = async (req, res) => {
//   const { childId } = req.params;

//   try {
//     // Find all tests for the child
//     const tests = await Test.find({ child_id: childId });
//     if (!tests.length) {
//       console.error('No tests found for child:', childId);
//       return res.status(404).json({ message: 'No tests found for this child' });
//     }

//     // Respond with the list of tests
//     res.status(200).json({ tests });
//   } catch (error) {
//     console.error('Error fetching tests for child:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };



const Test = require('../models/test');
const Child = require('../models/child');

exports.addTest = async (req, res) => {
    const { childId, test_name, reading_age, score, correctWords, incorrectWords } = req.body; // Add correctWords and incorrectWords to the body

    try {
        const test = new Test({
            child_id: childId,
            test_name,
            reading_age,
            score,
            correct_words: correctWords,  // Assuming you want to store these as well
            incorrect_words: incorrectWords,  // Assuming you want to store these as well
        });
        await test.save();

        // Increment the number of tests taken by the child
        await Child.findByIdAndUpdate(childId, {
            $inc: { tests_taken: 1 }
        });

        res.status(201).json({ message: 'Test added successfully', test });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get all tests for a specific child
exports.getTestsByChild = async (req, res) => {
    const { childId } = req.params;

    try {
        const tests = await Test.find({ child_id: childId });
        res.status(200).json({ tests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
