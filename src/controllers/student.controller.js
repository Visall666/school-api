import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

export const createStudent = async (req, res) => {
    try {
        const student = await db.Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema: 
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order based on created time
 *       - in: query
 *         name: populate
 *         schema: 
 *           type: string
 *         description: Include related models (e.g., TeacherId, CourseId)
 *     responses:
 *       200:
 *         description: List of courses
 */

export const getAllStudents = async (req, res) => {
    try {
        // Pagination
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;

        // Sorting
        const sortOrder = req.query.sort === 'desc' ? 'DESC' : 'ASC';

        // Populate (eager loading)
        const populate = req.query.populate;
        let include = [];

        const validRelations = {
        CourseId: {
            model: db.Course,
            include: []
        }
        };

        if (populate) {
        const relations = populate.split(',').map(r => r.trim());

        for (const rel of relations) {
            if (rel === 'CourseId') {
            validRelations.CourseId.include = []; 
            }
            if (rel === 'TeacherId') {
            // This will include Teacher nested inside Course
            if (validRelations.CourseId) {
                validRelations.CourseId.include.push({ model: db.Teacher });
            } else {
                validRelations.CourseId = {
                model: db.Course,
                include: [{ model: db.Teacher }]
                };
            }
            }
        }

        include = Object.values(validRelations);
        }

        // Count total
        const total = await db.Student.count();

        // Fetch with all options
        const students = await db.Student.findAll({
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', sortOrder]],
            include,
        });

        // Respone
        res.json({
            meta: {
                totalItems: total,
                page,
                totalPages: Math.ceil(total / limit),
            },
            data: students,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }


    // try {
    //     const students = await db.Student.findAll({ include: db.Course });
    //     res.json(students);
    // } catch (err) {
    //     res.status(500).json({ error: err.message });
    // }
};

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: A student
 *       404:
 *         description: Not found
 */
export const getStudentById = async (req, res) => {
    try {
        const student = await db.Student.findByPk(req.params.id, { include: db.Course });
        if (!student) return res.status(404).json({ message: 'Not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Updated
 */
export const updateStudent = async (req, res) => {
    try {
        const student = await db.Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Not found' });
        await student.update(req.body);
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 */
export const deleteStudent = async (req, res) => {
    try {
        const student = await db.Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Not found' });
        await student.destroy();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
