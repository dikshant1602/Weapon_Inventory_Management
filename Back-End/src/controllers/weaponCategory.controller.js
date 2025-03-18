import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { WeaponCategory } from "../models/weaponCategory.models.js";
import { WeaponDetail } from "../models/weaponDetalis.models.js";
import { BulletRecord } from "../models/bulletRecord.models.js";

const addWeaponCategories = asyncHandler(async (req, res) => {
    const categories = req.body; // assuming req.body contains the array of objects
    const createdCategories = [];
    const errors = [];

    for (const item of categories) {
        const { category, subCategory } = item; 

        if (!category || !subCategory) {
            errors.push({ category, message: "Please provide category and subCategory" });
            continue;
        }

        const categoryExist = await WeaponCategory.findOne({ category: category });

        if (categoryExist) {
        errors.push({ category, message: ` ${category} Category already exists` });
            continue;
        }

        const create = await WeaponCategory.create({
            category: category,
            subCategory: subCategory
        });

        createdCategories.push(create);
    }

    errors.push({message: "Remaining categories at successfully"});

    

    res.status(201).json(  new ApiResponse(201, {createdCategories , errors}, "Weapon Categories added successfully",));
});


// add sub category
 // category id and sub category name
    // sub category exist 
    // add sub category
    // res status 201


    const addSubCategories = asyncHandler(async (req, res) => {
        const { category, subCategories } = req.body;
    
        if (!category || !subCategories || !Array.isArray(subCategories)) {
            throw new ApiError(400, "Please provide category and an array of subCategories");
        }
    
        const categoryExist = await WeaponCategory.findOne({ category });
        if (!categoryExist) {
            throw new ApiError(400, "Category does not exist");
        }
    
        const existingSubCategories = categoryExist.subCategory;
    
        const newSubCategories = subCategories.filter(subCategory => !existingSubCategories.includes(subCategory));
    
        if (newSubCategories.length === 0) {
            throw new ApiError(400, "All provided subcategories already exist");
        }
    
        newSubCategories.forEach(subCategory => {
            categoryExist.subCategory.push(subCategory);
        });
    
        await categoryExist.save();
    
        res.status(201).json(new ApiResponse(201, categoryExist, "Sub Categories added successfully"));
    });
    
    

    const getCategories = asyncHandler(async (req, res) => {
        const categories = await WeaponCategory.find().select("category  _id ");
        if (categories.length === 0) {
            throw new ApiError(404, "No categories found");
        }
        res.status(200).json(  new ApiResponse(200, categories, "Weapon Categories fetched successfully"));
    });


    const  getSubCategories = asyncHandler(async (req, res) => {
        const { category } = req.params;

        const subCategories = await WeaponCategory.findOne({ category }).select("subCategory");

        res.status(200).json( new ApiResponse(200, subCategories, "Sub Categories fetched successfully"));
    });
    


    const getWeapon = asyncHandler(async (req, res) => {
        const { category, subCategory } = req.params;
        
        const weapons = await WeaponDetail.find({ category, subCategory }).select("name");

        if (weapons.length === 0) {
            throw new ApiError(404, "No weapons found");
        }

        res.status(200).json( ApiResponse(200, weapons, "Weapon fetched successfully"));

    })

    
    const addBullets = asyncHandler(async (req, res) => {
        const { bulletnames } = req.body;
    
        if (!Array.isArray(bulletnames) || bulletnames.length === 0) {
            throw new ApiError(400, "Please provide an array of bullet names");
        }
    
        const createdBullets = [];
        const errors = [];
    
        for (const bulletname of bulletnames) {
            if (!bulletname) {
                errors.push({ bulletname, error: "Bullet name is required" });
                continue;
            }
    
            const bulletExist = await BulletRecord.findOne({ typeName: bulletname });
    
            if (bulletExist) {
                errors.push({ bulletname, message: ` ${bulletname} Bullet already exists` });
                continue;
            }
    
            const create = await BulletRecord.create({
                typeName: bulletname
            });
    
            createdBullets.push(create);
        }

        errors.push({message: "Remaining bullet names add successfully"});
    
        
            res.status(201).json(new ApiResponse(201,{ createdBullets , errors}, "Bullets created successfully"));
       
    });

    
    const getBullets = asyncHandler(async (req, res) => {
        const bullets = await BulletRecord.find();

        console.log(bullets);
        res.status(200).json( new ApiResponse(200, bullets, "Bullets fetched successfully"));
    })


    
    

    


export { addWeaponCategories, addSubCategories , getCategories, getSubCategories, getWeapon , addBullets , getBullets}