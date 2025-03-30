from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError

class Users(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=10, choices=[('client', 'Client'), ('freelancer', 'Freelancer')])
    phone = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.username

class Freelancer(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='freelancer_profile')
    skills = models.TextField()
    
    def __str__(self):
        return self.user.username

class AboutFreelancer(models.Model):
    username = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to='AboutFreelancers/profile_pic')
    about_freelancer = models.TextField(null=True, blank=True)
    gitLinks = models.TextField(null=True, blank=True)
    links = models.TextField(null=True, blank=True)
    experience = models.TextField(null=True, blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name='about_freelancer', null=True, blank=True)
    
    def __str__(self):
        return f"{self.freelancer.user.username}'s Profile"

INDIAN_STATES = [
    ('', 'Select State'),
    ('AP', 'Andhra Pradesh'),
    ('AR', 'Arunachal Pradesh'),
    ('AS', 'Assam'),
    ('BR', 'Bihar'),
    ('CT', 'Chhattisgarh'),
    ('GA', 'Goa'),
    ('GJ', 'Gujarat'),
    ('HR', 'Haryana'),
    ('HP', 'Himachal Pradesh'),
    ('JK', 'Jammu and Kashmir'),
    ('JH', 'Jharkhand'),
    ('KA', 'Karnataka'),
    ('KL', 'Kerala'),
    ('MP', 'Madhya Pradesh'),
    ('MH', 'Maharashtra'),
    ('MN', 'Manipur'),
    ('ML', 'Meghalaya'),
    ('MZ', 'Mizoram'),
    ('NL', 'Nagaland'),
    ('OD', 'Odisha'),
    ('PB', 'Punjab'),
    ('RJ', 'Rajasthan'),
    ('SK', 'Sikkim'),
    ('TN', 'Tamil Nadu'),
    ('TG', 'Telangana'),
    ('TR', 'Tripura'),
    ('UP', 'Uttar Pradesh'),
    ('UT', 'Uttarakhand'),
    ('WB', 'West Bengal'),
    ('AN', 'Andaman and Nicobar Islands'),
    ('CH', 'Chandigarh'),
    ('DN', 'Dadra and Nagar Haveli and Daman and Diu'),
    ('DL', 'Delhi'),
    ('LD', 'Lakshadweep'),
    ('PY', 'Puducherry'),
]

class Client(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='client_profile')
    image = models.ImageField(upload_to='Client/profile_pic', null=True, blank=True)
    companyname = models.CharField(max_length=255)
    address = models.TextField(max_length=1024)
    state = models.CharField(max_length=255, choices=INDIAN_STATES)
    businessEmail = models.EmailField()

    def __str__(self):
        return self.user.username

STATUS_CHOICES = [
    ('open', 'Open'),
    ('in_progress', 'In Progress'),
    ('completed', 'Completed'),
    ('closed', 'Closed'),
]

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    skills_required = models.CharField(max_length=200)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    posted_by = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='posted_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return f"Project #{self.id} - {self.title}"

class Bid(models.Model):
    BID_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    bid_id=models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='bids')
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_time = models.IntegerField(help_text="Delivery time in days")
    proposal_text = models.TextField(help_text="Your detailed proposal explaining how you'll handle the project")
    proposal_highlights = models.TextField(null=True, blank=True, 
        help_text="Key points of your proposal (optional)")
    technical_approach = models.TextField(null=True, blank=True,
        help_text="Your technical approach to the project (optional)")
    status = models.CharField(max_length=20, choices=BID_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    milestone_breakdown = models.TextField(null=True, blank=True, 
        help_text="Breakdown of project milestones and deliverables")
    attachments = models.FileField(upload_to='bid_attachments/', null=True, blank=True)
    
    class Meta:
        unique_together = ['project', 'freelancer']
        ordering = ['-created_at']

    def __str__(self):
        return f"Bid by {self.freelancer.user.username} on {self.project.title}"

class Review(models.Model):
    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]
    
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='reviews_given')
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name='reviews_received')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)  # Make project optional
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        # If no project is associated, check review count
        if not self.project:
            review_count = Review.objects.filter(
                client=self.client,
                freelancer=self.freelancer,
                project__isnull=True
            ).count()
            if review_count >= 5:
                raise ValidationError("You can only submit up to 5 general reviews for a freelancer.")

    class Meta:
        ordering = ['-created_at']
        # Add a unique constraint only when project exists
        constraints = [
            models.UniqueConstraint(
                fields=['client', 'freelancer', 'project'],
                name='unique_project_review',
                condition=models.Q(project__isnull=False)
            )
        ]

    def __str__(self):
        project_info = f" on {self.project.title}" if self.project else ""
        return f"Review by {self.client.user.username} for {self.freelancer.user.username}{project_info}"


