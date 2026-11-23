# St. Jude Clinic Management System (MERN Stack + Podman)

A production-ready Clinic Management platform built with the **MERN** stack (MongoDB, Express.js, React, Node.js) and containerized with **Podman** for rootless, daemonless deployment on Ubuntu VPS behind an existing host Nginx reverse proxy.

---

## 🏥 Architecture & Features

### 1. Public Clinic Homepage (`/`)
* **Brand & Specialties**: Cardiology, Pediatrics, General Medicine, Orthopedics.
* **Doctor Directory & Timings**: Shift schedules, consulting fees, and department affiliations.
* **Reception Notice**: Informs patients that bookings are conducted exclusively via the receptionist desk by telephone or walk-in.

### 2. Clinic Staff Portal (`/login`)
* **Multi-Role Authentication**: JWT-based session with secure tokens.
* **Roles**: Admin, Receptionist, Doctor.
* **Zero-Config First Boot Seed**: An initial Admin account is automatically created on first startup using the `.env` credentials.

### 3. Reception Desk & Management (`/dashboard`)
* **Live Queue Board**: Real-time status tracker (`Waiting in Lobby`, `In Consultation`, `Completed`, `Cancelled`).
* **Quick Intake Modal**:
  - Instant patient phone lookup (or 3-field quick-registration for new patients).
  - Doctor shift slot generator (dynamic time-slot calculation excluding already booked slots).
  - Daily token number generation (e.g. `#1`, `#2`, `#3`...).
* **Patient Registry (`/dashboard/patients`)**: Searchable patient database with age, gender, contact, and medical visit records.
* **Appointments Archive (`/dashboard/appointments`)**: Filter past and future appointments by date and status.
* **Doctors & Shifts (`/dashboard/doctors`)**: Configure consulting fees, working days, and morning/evening shifts.

---

## 🚀 Deployment on Ubuntu VPS (Podman + Host Nginx)

### 1. Prerequisites
On your Ubuntu VPS, make sure Podman is installed:
```bash
sudo apt update
sudo apt install -y podman podman-compose
```

Enable lingering for your VPS user so containers remain running after you log out:
```bash
loginctl enable-linger $USER
```

### 2. Clone & Configure
```bash
git clone https://github.com/hashir-one/clinic-management-mern.git
cd clinic-management-mern

# Copy environment template and adjust passwords
cp .env.example .env
nano .env
```

### 3. Launch with Podman
Use the automated deployment script:
```bash
chmod +x scripts/deploy.sh scripts/backup-db.sh
./scripts/deploy.sh
```

Or run directly:
```bash
podman-compose up -d --build
```

Verify running containers:
```bash
podman ps
```

The containers will bind to local ports:
* **React Frontend**: `http://127.0.0.1:3000`
* **Express Backend**: `http://127.0.0.1:5000`
* **MongoDB**: Protected on the internal bridge network `clinic_net` (no host port exposed).

---

## 🔒 Host Nginx Configuration

In your existing Nginx virtual host (e.g., `/etc/nginx/sites-available/clinic.yourdomain.com`):

```nginx
server {
    server_name clinic.yourdomain.com; # Your domain

    # API Traffic -> Express Backend Container
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend UI -> React Nginx Container
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SSL configuration managed by your existing Certbot / Let's Encrypt setup
    listen 443 ssl;
    # ssl_certificate ...
    # ssl_certificate_key ...
}
```

Reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 🗄️ Automated Database Backups

Run backups manually:
```bash
./scripts/backup-db.sh
```

Or add to your crontab (`crontab -e`) for a nightly backup at 2:00 AM:
```cron
0 2 * * * /opt/clinic-management-mern/scripts/backup-db.sh >> /var/log/clinic_backup.log 2>&1
```

---

## 💻 Local Development (Without Containers)

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
