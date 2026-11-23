# Clinic Management System (MERN Stack)

A modern, responsive Clinic Management platform built with the MERN stack (MongoDB, Express.js, React, Node.js) and containerized with Podman for deployment on a Linux VPS behind an Nginx reverse proxy.

## Architecture Highlights
- **Public Homepage**: Clinic services, specialties, and doctor consultation timings.
- **Staff Portal**: Secure JWT authentication with role-based access control (Admin, Receptionist, Doctor).
- **Reception Desk Engine**: Patient phone/name lookup, quick registration, real-time slot selection, and daily queue token management.
- **Containerized**: Rootless Podman deployment with local host bindings (`127.0.0.1:3000` & `127.0.0.1:5000`) designed to sit behind an existing host-level Nginx reverse proxy.
