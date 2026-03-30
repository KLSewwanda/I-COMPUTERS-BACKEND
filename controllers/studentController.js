import Student from "../models/student.js";

export function getAllStudents(req, res) {
	Student.find().then(

		(students) => {
			res.json(students);
		}
		
	)
}

export async function getAllStudentsNew(req, res) {

	try{
		const students = await Student.find();
		res.json(students);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}

}


export function createStudent(req, res) {

	if(req.user == null) {
		res.status(401).json({ message: "Unauthorized" })
		return
	}

	if(req.user.isAdmin == false) {
		res.status(403).json({ message: "Only admins can create students" })
		return
	}

	const newStudent = new Student(req.body);

	newStudent.save().then(
		() => {
		res.json({
			message: "Student added successfully",
		});
	});

	// newStudent.save()

	// res.json({
	// 	message: "Student added successfully",
	// });

}
 