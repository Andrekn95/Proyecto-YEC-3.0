import { Global, Module } from '@nestjs/common';
import { coreProviders } from '@modules/core/core.provider';
import { SharedCoreModule } from '@modules/core/shared-core/shared-core.module';
import { StudentModule } from '@modules/core/roles/student/student.module';
import { CareerCoordinatorModule } from '@modules/core/roles/career-coordinator/career-coordinator.module';
import { TeacherModule } from '@modules/core/roles/teacher/teacher.module';

@Global()
@Module({
  imports: [SharedCoreModule, StudentModule, CareerCoordinatorModule, TeacherModule],
  providers: [...coreProviders],
})
export class CoreModule {}
