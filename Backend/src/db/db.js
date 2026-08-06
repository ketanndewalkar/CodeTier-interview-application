import mongoose from "mongoose"
import { Environment } from "../models/environment.model.js"

export const mongoDBConnect = async () =>{
    await mongoose.connect(process.env.MONGODB_URI)
    
    // Auto-seed environments if none exist
    try {
        const count = await Environment.countDocuments();
        if (count === 0) {
            console.log("No environments found in database. Seeding default environments...");
            await Environment.create([
                {
                    name: 'MERN Stack Environment',
                    language: 'REACT',
                    dockerImage: 'node:20-alpine',
                    workspaceTemplate: 'https://github.com/example/mern-template',
                    supportsPreview: true,
                    previewPort: 5173,
                    isActive: true
                },
                {
                    name: 'React + Node Environment',
                    language: 'REACT',
                    dockerImage: 'node:20-alpine',
                    workspaceTemplate: 'https://github.com/example/react-node-template',
                    supportsPreview: true,
                    previewPort: 5173,
                    isActive: true
                },
                {
                    name: 'Python Environment',
                    language: 'PYTHON',
                    dockerImage: 'python:3.11-slim',
                    workspaceTemplate: 'https://github.com/example/python-template',
                    supportsPreview: false,
                    isActive: true
                },
                {
                    name: 'Java / Spring Environment',
                    language: 'JAVA',
                    dockerImage: 'eclipse-temurin:17-alpine',
                    workspaceTemplate: 'https://github.com/example/java-template',
                    supportsPreview: false,
                    isActive: true
                }
            ]);
            console.log("Default environments seeded successfully ✅");
        }
    } catch (err) {
        console.error("Failed to seed default environments:", err.message);
    }
}