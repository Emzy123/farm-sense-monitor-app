-- Disable email confirmation requirement
UPDATE auth.config SET enable_signup = true, enable_confirm_email = false;