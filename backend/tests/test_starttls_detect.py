from app.pipeline.starttls_detect import analyze_starttls_flow

def test_implicit_tls():
    res = analyze_starttls_flow(b"\x16\x03\x03\x00\x20", b"", 993, "IMAP")
    assert res["status"] == "IMPLICIT_TLS"

def test_starttls_ok():
    c_payload = b"STARTTLS\r\n" + b"\x16\x03\x03\x00\x20"
    s_payload = b"220 2.0.0 Ready to start TLS\r\n"
    res = analyze_starttls_flow(c_payload, s_payload, 25, "SMTP")
    assert res["status"] == "STARTTLS_OK"
    assert res["downgrade_detected"] is False

def test_starttls_stripped_plaintext_auth():
    c_payload = b"EHLO client\r\nAUTH PLAIN dXNlcgBwYXNz\r\n"
    s_payload = b"250-mail\r\n250-STARTTLS\r\n"
    res = analyze_starttls_flow(c_payload, s_payload, 25, "SMTP")
    assert res["status"] == "STRIPPED"
    assert res["downgrade_detected"] is True
    assert res["plaintext_auth_observed"] is True

def test_plaintext_auth_no_starttls():
    c_payload = b"USER admin\r\nPASS Secret123\r\n"
    s_payload = b"+OK Ready\r\n"
    res = analyze_starttls_flow(c_payload, s_payload, 110, "POP3")
    assert res["status"] == "PLAINTEXT_AUTH"
    assert res["plaintext_auth_observed"] is True
