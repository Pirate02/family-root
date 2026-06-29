import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { createFamily, createPerson, getAllFamilyMembers, getFamily } from "../controllers/family.js";




const router: Router = Router();


router.post('/', authenticate, createFamily)
router.get('/:id', authenticate, getFamily)
router.post('/:id/persons', authenticate,createPerson )
router.get('/:id/persons', authenticate, getAllFamilyMembers)

export default router;
