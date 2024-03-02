
from eauth.throttling import SendEmailRateThrottle
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from rest_framework.exceptions import Throttled

def send_email_message(request, subject, body, to_email, html_content=None):
    throttle = SendEmailRateThrottle()
    if not throttle.allow_request(request, None):
        # --> except in views
        raise Throttled(detail="Слишком много запросов.")

    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_HOST_USER,
        to=to_email
    )
    if html_content:
        email.attach_alternative(html_content, "text/html")
    email.send()
    throttle.throttle_success()

    return True
