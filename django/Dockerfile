# Django Dockerfile
FROM python:3.10.7

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /usr/src/app

# Upgrade pip
RUN pip install --upgrade pip

# Install dependencies
RUN apt-get update && apt-get install -y libgl1-mesa-glx mariadb-client libmagic1
RUN apt-get install -y build-essential libpq-dev
# Uncomment the line above to install django-cors-headers
# RUN pip install django-cors-headers
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copy the application code
COPY . .

# Specify the location for wait-for-mysql.sh
COPY wait-for-mysql.sh /usr/src/app/wait-for-mysql.sh
COPY run.sh /usr/src/app/run.sh

# Give execution permissions
RUN chmod +x /usr/src/app/wait-for-mysql.sh && chmod +x /usr/src/app/run.sh

CMD ["/usr/src/app/wait-for-mysql.sh", "mysql", "/usr/src/app/run.sh"]
