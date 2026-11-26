package com.company.servicerequest.entity;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(nullable = false, length = 32)
    private String phone;

    @Column(nullable = false, name = "password_hash", length = 100)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private AccountStatus status = AccountStatus.PENDING_EMAIL_VERIFICATION;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 40)
    private Set<UserRole> roles = new HashSet<>();

    @Column(nullable = false, name = "created_at")
    private Instant createdAt = Instant.now();

    protected User() {}

    public User(String firstName, String lastName, String email, String phone, String passwordHash) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.status = AccountStatus.PENDING_EMAIL_VERIFICATION;
        this.roles.add(UserRole.CLIENT);
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPasswordHash() { return passwordHash; }
    public AccountStatus getStatus() { return status; }
    public Set<UserRole> getRoles() { return Set.copyOf(roles); }
    public Instant getCreatedAt() { return createdAt; }

    public void markEmailVerified() {
        if (status == AccountStatus.PENDING_EMAIL_VERIFICATION) {
            status = AccountStatus.PENDING_ID_VERIFICATION;
        }
    }

    public void setStatus(AccountStatus status) { this.status = status; }
}
