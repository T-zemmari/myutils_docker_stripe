# gunicorn.conf.py

import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
reload = True
timeout = 7200
limit_request_line = 0
limit_request_fields = 32768
limit_request_field_size = 0
limit_request_body = 2147483648
